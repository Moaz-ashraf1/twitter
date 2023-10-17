exports.sanitizeData = (user)=>{
    return {
        name : user.name,
        email:user.email
    }
}