interface Props {
  children: React.ReactNode;
  submit?: boolean;
  onClickMethod?: () => void;
}
const ButtonPrimary = ({ children, submit = false, onClickMethod }: Props) => {
  return (
    <button
      onClick={onClickMethod}
      type={submit ? "submit" : "button"}
      className="text-neutral-100 text-base text-sm bg-neutral-600 font-semibold shadow-[2px_1px_3px] shadow-neutral-500 hover:bg-neutral-300 hover:shadow-neutral-600 hover:text-neutral-800 transition duration-300 ease-in-out hover:scale-102 hover:font-extrabold"
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
