type ButtonProps = {
  text: string;
  onClick: () => void;
};

// General button used in app
export default function GeneralButton({ text, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
    >
      {text}
    </button>
  );
}
