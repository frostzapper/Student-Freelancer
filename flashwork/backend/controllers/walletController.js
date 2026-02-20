const { prisma } = require('../config/database');

const topup = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        wallet_balance: {
          increment: parseFloat(amount)
        }
      }
    });

    await prisma.paymentTransaction.create({
      data: {
        user_id: userId,
        amount: parseFloat(amount),
        type: 'topup',
        status: 'success'
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { wallet_balance: true }
    });

    res.json({ message: 'Topup successful', wallet_balance: user.wallet_balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user.wallet_balance < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        wallet_balance: {
          decrement: parseFloat(amount)
        }
      }
    });

    await prisma.withdrawalRequest.create({
      data: {
        user_id: userId,
        amount: parseFloat(amount),
        status: 'paid'
      }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { wallet_balance: true }
    });

    res.json({ message: 'Withdrawal successful', wallet_balance: updatedUser.wallet_balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { wallet_balance: true }
    });

    res.json({ wallet_balance: user.wallet_balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  topup,
  withdraw,
  getBalance
};
