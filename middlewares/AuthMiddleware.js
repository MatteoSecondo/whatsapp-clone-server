import jwt from 'jsonwebtoken'

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")
    
    if(!accessToken){
        return res.send({error: 'User not logged in.'})
    }
    
    try{
        const validToken = jwt.verify(accessToken, "RXxbKgsy9SqI2S6x1et3")
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