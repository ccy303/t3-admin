import SigninForm from "./ui/SigninForm";

export default async function Signin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SigninForm />
    </main>
  );
}
