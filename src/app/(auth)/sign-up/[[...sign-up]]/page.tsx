import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center p-7">
      <SignUp redirectUrl={"/escolha-agendamento"} />
    </div>
  );
}
