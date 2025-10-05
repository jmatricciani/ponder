interface Props {
  children: React.ReactNode;
  icon: "total-words-icon" | "total-chars-icon";
}
const ButtonInfo = ({ children, icon }: Props) => {
  return (
    <span className="w-25 text-neutral-200 font-semibold text-sm flex items-center gap-5 bg-neutral-600 rounded-sm p-3 py-2">
      <i className={icon}></i>
      <span className="ml-auto">{children}</span>
    </span>
  );
};

export default ButtonInfo;
