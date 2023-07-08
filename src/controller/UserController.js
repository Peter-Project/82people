const { User } = require('../db/models');

const UserController = {
	updateUser: async (req, res, next) => {
		const { email, password, address } = await req.body; //address:Object[] = required:false

		try {
			if (!email || !password) {
				throw new Error('누락된 값이 있습니다.');
			}

			await User.updateOne({ email }, { password, address });
		} catch (err) {
			next(err);
		}

		return res.status(200).json({
			message: '회원 정보 수정 성공',
		});
	},

	deleteUser: async (req, res, next) => {
		const { email } = await req.body;

		try {
			await User.updateOne({ email }, { deletedAt: true });
		} catch (err) {
			next(err);
		}
		return res.status(200).json({
			message: '회원 탈퇴 성공',
		});
	},

	userSignup: async (req, res, next) => {
		const { email, name, password } = await req.body;
		const isSignup = User.findOne({ email });

		try {
			if (isSignup) {
				throw new Error('이미 가입 된 이메일 입니다.');
			}
			await User.create({
				email,
				name,
				password,
			});
		} catch (err) {
			next(err);
		}

		return res.status(201).json({
			msg: '가입 완료',
		});
	},

	getUserInformation: async (req, res, next) => {
		const email = req.currentUserEmail;

		try {
			const findUser = await User.findOne({ email });

			return res.status(200).json({
				msg: '회원 정보 조회 완료',
				userInformation: findUser,
			});
		} catch (err) {
			next(err);
		}
	},
};

module.exports = { UserController };
