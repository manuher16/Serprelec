import User from "../../models/user";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid credentials"
                });
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(500).json({
                        message: "Error signing token"
                    });
                } else {
                    res.status(200).json({
                        message: "Login successful",
                        token: token
                    });
                }
            });
        });
    });
};



export default login;