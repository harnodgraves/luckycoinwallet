import { useAppState } from "../states/appState";
import { ss } from "../utils";
import { useEffect, useState } from "react";

export const useUpdateAddressBook = () => {
  const { updateAppState, addressBook } = useAppState(
    ss(["updateAppState", "addressBook"])
  );

  return async (address?: string) => {
    if (!address) return;
    if (addressBook.length >= 6) addressBook.splice(5, 1);
    if (addressBook.includes(address.trim())) return;
    addressBook.unshift(address.trim() ?? "");
    await updateAppState({ addressBook: addressBook });
  };
};

export const useMouseAndScreen = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Update mouse position on mousemove
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Update screen dimensions on resize
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { mousePosition, screenDimensions };
};
