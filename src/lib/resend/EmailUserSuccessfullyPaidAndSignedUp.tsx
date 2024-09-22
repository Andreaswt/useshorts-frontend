import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailUserSuccessfullyPaidAndSignedUpProps {
  userEmail?: string;
  resetPasswordToken?: string;
}
const baseUrl = process.env.NEXTAUTH_URL;

export const EmailUserSuccessfullyPaidAndSignedUp = ({
  userEmail = "andreas.trolle@hotmail.com",
  resetPasswordToken = "abcdefg1234567",
}: EmailUserSuccessfullyPaidAndSignedUpProps) => {
  const resetPasswordUrl = `${baseUrl}/reset-password?token=${resetPasswordToken}`;

  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Body style={bodyStyle}>
        <Section style={headerStyle}>
          <Container>
            <Link href="https://useshorts.app" target="_blank">
              <Img
                src={"https://app.useshorts.app/logo.png"}
                alt="Useshorts"
                height={64}
                style={{ marginLeft: "auto", marginRight: "auto" }}
              />
            </Link>
          </Container>
        </Section>

        <Container style={mainContainerStyle}>
          <Heading style={{ fontSize: "22px", color: "#333333" }}>
            Welcome!
          </Heading>
          <Text style={normalTextStyle}>
            We&apos;re thrilled to have you start using Shorts. To get the most
            out of Shorts, get started with the following steps:
          </Text>
          <Text style={normalTextStyle}>
            <ol>
              <li style={{ marginBottom: "16px" }}>
                <Text style={normalTextNoMarginStyle}>
                  Set up your account (instructions below)
                </Text>
              </li>
              <li style={{ marginBottom: "16px" }}>
                <Text style={normalTextNoMarginStyle}>
                  Upload your first video
                </Text>
              </li>
              <li style={{ marginBottom: "16px" }}>
                <Text style={normalTextNoMarginStyle}>
                  Generate animated videos with one click
                </Text>
              </li>
              <li style={{ marginBottom: "16px" }}>
                <Text style={normalTextNoMarginStyle}>
                  Customize your videos and download them
                </Text>
              </li>
            </ol>
          </Text>
          <Text style={normalTextStyle}>
            <strong>Account setup instructions: </strong> Follow the link below
            to set your password:
          </Text>

          <Section style={{ padding: "16px", backgroundColor: "#f4f4f7" }}>
            <Text style={normalTextNoMarginStyle}>
              <strong>Login Page: </strong>
              <Link href={`${resetPasswordUrl}`} target="_blank">
                {resetPasswordUrl}
              </Link>
            </Text>
            <Text style={normalTextNoMarginStyle}>
              <strong>Login Email: </strong> {userEmail}
            </Text>
          </Section>

          <Text style={normalTextStyle}>
            If you have any questions, feel free to reply to this email, and we
            will be in touch with you as soon as possible.
          </Text>

          <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
            <Text style={normalTextNoMarginStyle}>Thanks,</Text>
            <Text style={normalTextNoMarginStyle}>Andreas</Text>
          </Section>

          <Text style={normalTextStyle}>
            <strong>P.S. </strong>Need immediate help getting started? Just
            reply to this email, and we will be happy to help!
          </Text>
        </Container>

        <Section style={footerPart1Style}>
          <Container>
            <Text style={{ textAlign: "center", marginTop: 0 }}>
              © {new Date().getFullYear()}{" "}
              <Link href="https://useshorts.app">useshorts.app</Link>. All
              rights reserved.
            </Text>
            <Text style={{ textAlign: "center", marginTop: 0 }}>
              <Link href="https://useshorts.app">useshorts.app</Link>
            </Text>
          </Container>
        </Section>
        <Section style={footerPart2Style}>
          <Container>
            <Link href="https://useshorts.app" target="_blank">
              <Img
                src={"https://app.useshorts.app/logo.png"}
                alt="Shorts"
                height={32}
                style={centeredStyle}
              />
            </Link>
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default EmailUserSuccessfullyPaidAndSignedUp;

const centeredStyle = {
  marginLeft: "auto",
  marginRight: "auto",
};

const normalTextStyle = {
  fontSize: "16px",
  fontWeight: 400,
  color: "#51545E",
  marginTop: "19px",
};

const normalTextNoMarginStyle = {
  fontSize: "16px",
  fontWeight: 400,
  color: "#51545E",
  margin: 0,
};

const bodyStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily: '"Nunito Sans",Helvetica,Arial,sans-serif',
};

const headerStyle = {
  width: "100%",
  paddingTop: "32px",
  paddingBottom: "32px",
  backgroundColor: "#f4f4f7",
};

const mainContainerStyle = {
  padding: "32px",
};

const footerPart1Style = {
  width: "100%",
  paddingTop: "32px",
  paddingBottom: "0px",
  backgroundColor: "#f4f4f7",
};

const footerPart2Style = {
  width: "100%",
  paddingTop: "8px",
  paddingBottom: "32px",
  backgroundColor: "#f4f4f7",
};
