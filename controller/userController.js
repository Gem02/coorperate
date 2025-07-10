const UserModel = require('../models/User');

const fetchUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId; 

    const user = await UserModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fetchUserProfile };
