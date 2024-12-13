import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center p-7">
      <SignUp fallbackRedirectUrl={"/escolha-agendamento"} />
    </div>
  );
}
