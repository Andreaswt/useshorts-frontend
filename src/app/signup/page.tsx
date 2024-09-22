import SignupComponent from "~/components/client/dashboard/signup/Signup";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const ref = searchParams.ref;
  const affiliateId = searchParams.aid;
  const email = searchParams.email;

  return (
    <SignupComponent
      referralCode={typeof ref === "string" ? ref : null}
      affiliateId={typeof affiliateId === "string" ? affiliateId : null}
      urlEmail={typeof email === "string" ? email : null}
    />
  );
}
