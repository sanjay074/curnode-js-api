const jwt = require('jsonwebtoken');
const UserToken = require('../auth/models/UserToken');
const verifyRefreshToken = (refreshToken)=>{
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY ;
    return new Promise((resolve ,reject)=>{
        UserToken.findOne({token:refreshToken},(error,doc)=>{
            if(!doc)
            return reject({error:true,message:"Invalid refresh token"});
            jwt.verify(refreshToken,privateKey,(err,tokenDetails)=>{
                if(err)
                return reject({error:true,message:"nvalid refresh token"});
                resolve({
                    tokenDetails,
                    error:false,
                    message:"Valid refresh token",
                });
            })
        })
    })
}  
module.exports= verifyRefreshToken;