import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center p-7">
      <SignIn redirectUrl={"/servicos"} />
    </div>
  );
}
