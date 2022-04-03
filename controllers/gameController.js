const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const { LEVELS } = require("../data/LEVELS");
const { RELICS } = require("../data/RELICS");

exports.unlockLevel = catchAsync(async (req, res, next) => {
  //1) Fetch all params
  const { unlockLevel, unconditional } = req.body;
  if (!unlockLevel) {
    return next(new AppError("You have to provide which level to unlock", 500));
  }

  //2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError("No user found", 500));
  }

  if (!Object.keys(LEVELS).includes(unlockLevel)) {
    return next(new AppError("Invalid level name", 500));
  }

  if (foundUser.unlockedLevels.includes(unlockLevel)) {
    return next(new AppError("You already unlocked this level", 500));
  }

  foundUser.unlockedLevels = [...foundUser.unlockedLevels, String(unlockLevel)];

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.beatLevel = catchAsync(async (req, res, next) => {
  //1) Fetch all params
  const { level, stars, unlockNext } = req.body;
  if (!level) {
    return next(new AppError("You have to provide which level", 500));
  }

  //2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError("No user found", 500));
  }

  // 3) Add the Stars to the User
  if (stars) foundUser.stars += stars;

  // 3) Find the next level to unlock
  if (unlockNext) {
    const foundIndex = Object.keys(LEVELS).findIndex((lvl) => lvl === level);
    if (foundIndex === -1) return next(new AppError("Invalid level name", 500));
    if (Object.keys(LEVELS).length - 1 > foundIndex) {
      const nextLevel = Object.keys(LEVELS)[foundIndex + 1];
      if (foundUser.unlockedLevels.includes(nextLevel)) {
        // Do nothing and move on if the user already unlocked the next level
      } else {
        foundUser.unlockedLevels = [
          ...foundUser.unlockedLevels,
          String(nextLevel),
        ];
      }
    } else {
      return next(new AppError("There is no higher level to unlock", 500));
    }
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.unlockRelic = catchAsync(async (req, res, next) => {
  //1) Fetch all params
  const { relic, cost } = req.body;

  if (!relic || !cost) {
    return next(
      new AppError("You have to provide which relic and cost to unlock", 500)
    );
  }

  //2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError("No user found", 500));
  }

  if (!Object.keys(RELICS).includes(relic)) {
    return next(new AppError("Invalid relic name", 500));
  }

  if (foundUser.unlockedRelics.includes(relic)) {
    return next(new AppError("User already has this relic", 500));
  }

  if (foundUser.stars < cost) {
    return next(new AppError("Insufficient stars", 500));
  } else foundUser.stars -= cost;

  foundUser.unlockedRelics = [...foundUser.unlockedRelics, String(relic)];

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.selectRelic = catchAsync(async (req, res, next) => {
  //1) Fetch all params
  const { relic } = req.body;

  if (!relic) {
    return next(new AppError("You have to provide which relic to unlock", 500));
  }

  //2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError("No user found", 500));
  }

  if (!Object.keys(RELICS).includes(relic)) {
    return next(new AppError("Invalid relic name", 500));
  }

  if (!foundUser.unlockedRelics.includes(relic)) {
    return next(new AppError("User hasn't unlocked this relic yet", 500));
  }

  foundUser.selectedRelic = relic;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
