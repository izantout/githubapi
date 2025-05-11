import Image from "next/image";

type AvatarProps = {
  src: string;
  alt?: string;
};

export default function Avatar({ src, alt = "User Avatar" }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className="w-40 h-40 rounded-full object-cover mb-2"
    />
  );
}
