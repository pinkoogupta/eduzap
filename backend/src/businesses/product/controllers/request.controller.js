import Request from "../../../models/request.model.js";
import redisClient from "../../../utils/redis.util.js";
import { getIO } from "../../../utils/socket.js";
import { uploadToCloudinary } from "../../../utils/cloudinary.js";

// Helper: clear caches
const clearCache = async () => {
  await redisClient.del("requests:all");
  await redisClient.del("requests:sorted:asc");
  await redisClient.del("requests:sorted:desc");
  await redisClient
    .keys("requests:search:*")
    .then((keys) => keys.forEach((k) => redisClient.del(k)));
};

// POST /requests
const createRequest = async (req, res) => {
  try {
    const { name, phone, title } = req.body;

    if (!name?.trim() || !phone?.trim() || !title?.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Name, phone, and title are required" });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer); // ✅ use buffer
    }

    const newRequest = await Request.create({
      name: name.trim(),
      phone: phone.trim(),
      title: title.trim(),
      image: imageUrl,
    });

    await clearCache();

    getIO().emit("request:created", newRequest);

    return res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET /requests
const getRequests = async (req, res) => {
  try {
    const cacheKey = "requests:all";
    const cached = await redisClient.get(cacheKey);
    if (cached)
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });

    const requests = await Request.find().sort({ createdAt: -1 }).lean();
    await redisClient.setEx(cacheKey, 60, JSON.stringify(requests));

    return res.json({ success: true, data: requests, cached: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET /requests/sorted
const getSortedRequests = async (req, res) => {
  try {
    const order = req.query.order === "desc" ? -1 : 1;
    const cacheKey = `requests:sorted:${order === 1 ? "asc" : "desc"}`;
    const cached = await redisClient.get(cacheKey);
    if (cached)
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });

    const requests = await Request.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ title: order })
      .lean();

    await redisClient.setEx(cacheKey, 60, JSON.stringify(requests));
    return res.json({ success: true, data: requests, cached: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET /requests/search
const searchRequests = async (req, res) => {
  try {
    const q = (req.query.title || "").trim();
    const cacheKey = `requests:search:${q.toLowerCase()}`;
    const cached = await redisClient.get(cacheKey);
    if (cached)
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });

    const filter = q ? { title: { $regex: q, $options: "i" } } : {};
    const requests = await Request.find(filter).sort({ createdAt: -1 }).lean();

    await redisClient.setEx(cacheKey, 60, JSON.stringify(requests));
    return res.json({ success: true, data: requests, cached: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// DELETE /requests/:id
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Request.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, error: "Request not found" });

    await clearCache();

    getIO().emit("request:deleted", { id });
    return res.json({ success: true, data: { id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Export individual functions
export {
  createRequest,
  getRequests,
  getSortedRequests,
  searchRequests,
  deleteRequest,
};
