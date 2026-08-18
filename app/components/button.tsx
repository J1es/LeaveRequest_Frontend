export default function Button(
    { children, onClick }: {
        children: React.ReactNode;
        onClick: () => void
    }) {
    return <button
        className="p-3 bg-teal-500 text-white rounded-lg active:translate-y-1 transition-all duration-200"
        onClick={onClick}
    >{children}</button>
}
