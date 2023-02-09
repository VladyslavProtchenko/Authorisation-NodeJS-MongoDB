const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')

const generateAccessToken = (id,roles) => {
    const payload ={id,roles}
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async registration(req, res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message:"registration error", errors})
            }

            const {username, password} = req.body;
                const candidate = await User.findOne({username})
                if(candidate) {
                    return res.status(400).json({message: 'user is already exists'})
                }
                const hashPassword = bcrypt.hashSync(password, 7)
                const userRole = await Role.findOne({value: 'USER'})
                const user = new User({username: username,password: hashPassword, roles: [userRole.value]})
                console.log(user);
                await user.save()
                return res.json({message: 'user successfully registered'})

        } catch (error) {
            console.log(error);
            res.status(400).json({message: error})
        }
    }
    async login(req, res){
        try {
            const {username,password} = req.body;
            const user = await User.findOne({username})
            if(!user) res.status(400).json({message:"user not exist"})

            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) res.status(400).json({message:'incorrect password'})

            const token = generateAccessToken(user._id, user.roles);
            return res.json({token})
            
        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'login error'})
        }
    }
    async getUsers(req, res){
        try {
            // DB Roles creating
            // const userRole = new Role()
            // const adminRole = new Role({value: 'ADMIN'})
            // console.log(userRole);
            // console.log(adminRole);
            // await userRole.save();
            // await adminRole.save();

            const users = await User.find()
            res.json(users)
        } catch (error) {
            
        }
    }
} 

module.exports = new authController();