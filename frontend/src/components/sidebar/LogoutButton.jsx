import { BiLogOut } from "react-icons/bi";
import useAuthStore from "../../zustand/useAuthStore";

const LogoutButton = () => {
  const { loading, logout } = useAuthStore();
  
  return (
    <div className="mt-auto">
      {!loading ? (
        <BiLogOut className="w-6 h-6 text-white cursor-pointer" onClick={logout} />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
    </div>
  );
};

export default LogoutButton;