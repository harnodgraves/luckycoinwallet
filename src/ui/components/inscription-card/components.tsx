import { getContentUrl } from "@/shared/constant";
import { shortAddress } from "@/shared/utils/transactions";
import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  inscriptionId: string;
}

const applyPixelation = (img?: HTMLImageElement) => {
  if (!img) return;

  if (img.naturalWidth < 100 || img.naturalHeight < 100) {
    img.style.imageRendering = "pixelated";
  }
};

const InscriptionCard: FC<Props> = ({ inscriptionId }) => {
  const navigate = useNavigate();

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        applyPixelation(imageRef.current);
      } else {
        imageRef.current.onload = () => {
          applyPixelation(imageRef.current!);
        };
      }
    }
  });

  return (
    <div className="flex justify-center w-full">
      <div
        className="cursor-pointer flex flex-col justify-center align-center relative"
        onClick={() => {
          navigate("/pages/inscription-details", {
            state: { inscription_id: inscriptionId },
          });
        }}
      >
        <div className="rounded-xl w-full bg-slate-950 bg-opacity-50">
          <img
            ref={imageRef}
            src={`${getContentUrl()}/preview/${inscriptionId}`}
            alt="content"
            className="object-cover rounded-xl h-38 w-38"
            style={{
              imageRendering: "auto",
            }}
          />
        </div>
        <div className="absolute bottom-0 px-1 bg-black/50 backdrop-blur-sm left-0 text-xs text-white">
          {shortAddress(inscriptionId, 6)}
        </div>
      </div>
    </div>
  );
};

export default InscriptionCard;
