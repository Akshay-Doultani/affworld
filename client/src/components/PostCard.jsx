import React from "react";

const PostCard = ({ post, isOwner, onEdit, onDelete }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <img
                className="w-full"
                src={post.imageUrl}
                alt="Post"
            />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{post.userId?.username}</div>
                <p className="text-gray-700 text-base">{post.caption}</p>
            </div>
            {isOwner && (
                <div className="px-6 py-4 flex justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => onEdit(post)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => onDelete(post._id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostCard;
