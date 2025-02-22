// app/CharacterCount.js
'use client';

const CharacterCount = ({ text }) => {
    return (
        <div className="mt-2 text-right text-sm text-gray-500">
            Characters: {text.length}
        </div>
    );
};

export default CharacterCount;