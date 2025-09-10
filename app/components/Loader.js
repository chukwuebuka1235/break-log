import Image from "next/image";

export function Loader() {
    return (
        <div className="h-screen bg-[#ec3338] flex items-center justify-center">
            <Image src="/loader.gif" alt="Loading..." width={100} height={100} />
        </div>
    )
}