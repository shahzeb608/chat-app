import { useEffect } from "react";
import useGroupStore from "../zustand/useGroupStore";
import toast from "react-hot-toast";

const useGetGroups = () => {
  const { groups, setGroups, setLoadingGroups } = useGroupStore();

  useEffect(() => {
    const getGroups = async () => {
      setLoadingGroups(true);
      try {
        const res = await fetch("/api/groups", {
          credentials: "include"
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setGroups(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingGroups(false);
      }
    };

    getGroups();
  }, [setGroups, setLoadingGroups]);

  return { groups };
};

export default useGetGroups;