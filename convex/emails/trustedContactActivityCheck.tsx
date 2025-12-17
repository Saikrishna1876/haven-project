import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const TrustedContactActivityCheck = (props: {
  contactName?: string;
  userName?: string;
  userEmail?: string;
  lastActiveDate?: string;
  companyName?: string;
  inactivityDays?: number;
  siteUrl: string;
  token: string;
}) => {
  const {
    contactName = "there",
    userName = "John",
    userEmail = "john@example.com",
    lastActiveDate = "2 weeks ago",
    companyName = "Haven",
    inactivityDays = 21,
    siteUrl,
    token,
  } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Wellness check: We haven't heard from {userName} in a while
        </Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white mx-auto px-10 py-10 rounded-xl max-w-150">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-6 font-bold text-gray-900 m-0 mb-xl">
                Wellness Check Request
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-4 text-gray-800 mb-4 leading-6">
                Hello {contactName},
              </Text>

              <Text className="text-4 text-gray-800 mb-4 leading-6">
                {userName} ({userEmail}) has listed you as a trusted contact on{" "}
                <span className="font-bold">{companyName}</span>.
              </Text>

              <Text className="text-4 text-gray-800 mb-4 leading-6">
                We haven't seen any activity from {userName} since{" "}
                {lastActiveDate} ({inactivityDays} days). Could you please let
                us know if you've been in contact with them recently?
              </Text>

              {/* Action Buttons */}
              <Section className="text-center mb-6">
                <Button
                  href={`${siteUrl}/wellness-check/confirm?token=${token}`}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl text-4 font-medium no-underline box-border inline-block mr-4 mb-xl"
                >
                  Yes, they're doing fine.
                </Button>
                <Button
                  href={`${siteUrl}/wellness-check/concern?token=${token}`}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl text-4 font-medium no-underline box-border inline-block mb-xl"
                >
                  No, they won't be active
                </Button>
              </Section>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Footer */}
            <Section>
              <Text className="text-3 text-gray-500 leading-4 m-0">
                <span className="font-bold">{companyName}</span> Security Team
                <br />
                456 Safety Boulevard, Suite 200
                <br />
                Austin, TX 78701
                <br />
                United States
              </Text>
              <Text className="text-3 text-gray-500 leading-4 mt-4 m-0">
                ©️ {new Date().getFullYear()}{" "}
                <span className="font-bold">{companyName}</span>. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TrustedContactActivityCheck.PreviewProps = {
  contactName: "Sarah Johnson",
  userName: "Alex Smith",
  userEmail: "alex.smith@email.com",
  lastActiveDate: "March 1st",
  companyName: "HAVEN",
  inactivityDays: "14",
};

export default TrustedContactActivityCheck;
