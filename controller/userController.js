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

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // Exclude passwords
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const getAllUsersForManager = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all users whose managerId matches the given manager's userId
    const users = await UserModel.find({ managerId: userId }).select('-password');

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const getAllUsersForAmbassador = async (req, res) => {
  const { userId } = req.params;

  try {
    const users = await UserModel.find({ ambassadorId: userId }).select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByIdAndUpdate(
      id,
      { suspended: true },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User has been suspended successfully",
      user,
    });
  } catch (error) {
    console.error("Suspend user error:", error);
    return res.status(500).json({
      message: "Failed to suspend user",
      error: error.message,
    });
  }
};

const unsuspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByIdAndUpdate(
      id,
      { suspended: false },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User has been unsuspended successfully",
      user,
    });
  } catch (error) {
    console.error("Unsuspend user error:", error);
    return res.status(500).json({
      message: "Failed to unsuspend user",
      error: error.message,
    });
  }
};



module.exports = { fetchUserProfile, getAllUsersForAmbassador, getAllUsersForManager, getAllUsers, deleteUser, suspendUser, unsuspendUser };
