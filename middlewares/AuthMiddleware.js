import jwt from 'jsonwebtoken'

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")
    
    if(!accessToken){
        return res.send({error: 'User not logged in.'})
    }
    
    try{
        const validToken = jwt.verify(accessToken, process.env.JWT_STRING)
        req.user = validToken

        if(validToken){
            return next()
        }
    }
    catch(err){
        return res.send({error: err})
    }
}

export default validateToken