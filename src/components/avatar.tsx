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
      width={260}
      height={260}
      className="rounded-full object-cover mb-2"
    />
  );
}
