
import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";


export const sendMessage = async (req, res) => {
     
	try {
		const { message } = req.body;
        //const message = req.body.message; both are same
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

         //we can change it so we uses let
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

     //if user first time message so 
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

        //now lets create message for both sender and receiver

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

        //now if new message is created
		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}
        // await conversation.save(); //if this takes 1 s
        // await newMessage.save(); // so this takes 2 s

        // but here we parrallel it so no waiting and run excact same time

        //this will run parallel
        await Promise.all([conversation.save()],[newMessage.save()]);

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server erorrr" });
	}
};

export const getMessages  = async (req,res)=>{
    try {
        const {id:userToChatId}= req.params;
        const senderId = req.user._id; //this is comes from protectRoute
        
        //lets get already conversation
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]},

        }).populate("messages") //in converstion we have only messages id's and we dont know the message content so mongoose provides us this populate method to get message from id
        
        //if no conversation
        if(!conversation){
            return res.status(200).json([]);//empty message
        }
        res.status(200).json(conversation.messages)
        
        
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server erorrr" });
     
    }
}