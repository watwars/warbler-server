const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required:true,
        maxlength:160,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


//delete message in user as well
messageSchema.pre("remove", async function(next){
    try{
        //find user
        let user = await User.findById(this.user);
        //remove id from the list
        user.messages.remove(this.id);
        //save user
        await user.save();
        // next
        return next();
    }catch(e){
        return next(e);
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;