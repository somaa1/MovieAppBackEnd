import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	searchHistory: {
		type: Array,
		default: [],
	},
	accountId: {
		type: String,
		required: false,
	},
	favorites: [
        {
            mediaId: String,
            mediaType: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

export const User = mongoose.model("User", userSchema);
