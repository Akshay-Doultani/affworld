import React from 'react';
import Modal from 'react-modal';


const ImageModal = ({ isOpen, onRequestClose, imageUrl }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={true}
            contentLabel="Enlarged Image"
            className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl w-full h-auto p-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        >
            <div>
                <img src={imageUrl} alt="Enlarged" className="w-full h-auto rounded-md" />
                <button
                    onClick={onRequestClose}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md absolute top-4 right-4"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ImageModal;
