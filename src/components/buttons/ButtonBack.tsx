import { useNavigate } from "react-router";

interface Props {
  children: React.ReactNode;
  navigateTo: string;
}
const ButtonBack = ({ children, navigateTo }: Props) => {
  const navigate = useNavigate();
  return (
    <span
      onClick={() => navigate(navigateTo)}
      className="hover:cursor-pointer text-neutral-100 flex items-center gap-1 text-base text-sm font-semibold hover:text-neutral-800 transition duration-300 ease-in-out hover:scale-102 hover:font-extrabold"
    >
      <i className="chev-left self-center"></i>
      {children}
    </span>
  );
};

export default ButtonBack;
