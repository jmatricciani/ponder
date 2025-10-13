interface Props {
  children: React.ReactNode;
  onClickMethod?: () => void;
}

const ButtonSidebar = ({ children, onClickMethod }: Props) => {
  return (
    <button
      onClick={onClickMethod}
      type="button"
      className="text-neutral-100 text-base text-sm text-left bg-[#242424] transition duration-300 ease-in-out hover:font-underline"
    >
      {children}
    </button>
  );
};

export default ButtonSidebar;
