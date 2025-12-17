import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface Asset {
  _id?: string;
  name?: string;
  provider?: string;
  providerAccountId?: string;
  createdAt?: string | number | Date;
  encryptedData?: unknown;
  backupCodes?: string[];
}

interface AccountRecoveryEmailProps {
  userId?: string;
  email?: string;
  fullName?: string;
  accountCreated?: string;
  lastLogin?: string;
  phoneNumber?: string;
  hasSecurityQuestions?: boolean;
  hasTwoFA?: boolean;
  backupCodes?: string[];
  assets?: Asset[];
  userData?: any;
  recoveryLink?: string;
}

const AccountRecoveryEmail: React.FC<AccountRecoveryEmailProps> = (props) => {
  const recoveryCode = `// Step 1: Navigate to the official Google recovery page
https://accounts.google.com/signin/recovery

// Step 2: Enter the account email
${props.email || "(email not provided)"}

// Step 3: Use any available backup codes (one per line):
${(props.backupCodes || []).join("\n") || "No backup codes available"}

// Step 4: Follow the on-screen verification steps as prompted by Google`;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Google Account Recovery — Information to help regain access
        </Preview>
        <Body className="bg-gray-100 font-sans py-8">
          <Container className="bg-white rounded-xl shadow-lg max-w-170 mx-auto p-8">
            <Section>
              <Heading className="text-[22px] font-bold text-gray-900 mb-2 text-center">
                Google Account Recovery Information
              </Heading>
              <Text className="text-[14px] text-gray-600 mb-4 text-center">
                This message summarizes the recovery information we have for the
                account listed below. Use it to help follow Google's official
                recovery process.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-5" />

            <Section>
              <Heading className="text-[18px] font-bold text-gray-900 mb-3">
                Account Summary
              </Heading>

              <div className="bg-gray-50 p-4 rounded-[6px] mb-4">
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>User ID:</strong> {props.userId || "(not available)"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Email:</strong> {props.email || "(not available)"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Full Name:</strong>{" "}
                  {props.fullName || "(not available)"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Account Created:</strong>{" "}
                  {props.accountCreated || "(unknown)"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Last Login:</strong> {props.lastLogin || "(unknown)"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Phone:</strong> {props.phoneNumber || "Not provided"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Security Questions:</strong>{" "}
                  {props.hasSecurityQuestions ? "Yes" : "No"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Two-Factor Authentication:</strong>{" "}
                  {props.hasTwoFA ? "Enabled" : "Disabled"}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Backup Codes:</strong>{" "}
                  {(props.backupCodes || []).length} codes
                </Text>
              </div>

              {props.backupCodes && props.backupCodes.length > 0 && (
                <div className="mb-4">
                  <Heading className="text-[16px] font-medium text-gray-900 mb-2">
                    Backup Codes (listed)
                  </Heading>
                  <div className="bg-gray-50 p-3 rounded-[6px]">
                    <pre
                      className="text-[13px] font-mono m-0 p-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {(props.backupCodes || []).join("\n")}
                    </pre>
                  </div>
                </div>
              )}

              {props.assets && props.assets.length > 0 && (
                <div className="mb-4">
                  <Heading className="text-[16px] font-medium text-gray-900 mb-2">
                    App-stored Assets
                  </Heading>
                  <div className="bg-gray-50 p-3 rounded-[6px]">
                    {props.assets.map((a, i) => (
                      <div key={a._id || i} className="mb-2.5">
                        <Text className="text-[14px] text-gray-700 m-0">
                          <strong>Name:</strong> {a.name || "unnamed"}
                        </Text>
                        <Text className="text-[14px] text-gray-700 m-0">
                          <strong>Provider:</strong> {a.provider || "N/A"}{" "}
                          {a.providerAccountId
                            ? `- ${a.providerAccountId}`
                            : ""}
                        </Text>
                        <Text className="text-[14px] text-gray-700 m-0">
                          <strong>Created:</strong>{" "}
                          {a.createdAt
                            ? new Date(a.createdAt).toISOString()
                            : "unknown"}
                        </Text>
                        <Text className="text-[14px] text-gray-700 m-0">
                          <strong>Has Encrypted Data:</strong>{" "}
                          {a.encryptedData ? "Yes" : "No"}
                        </Text>
                        {Boolean(a.encryptedData) && (
                          <div className="mt-1.5 mb-1.5">
                            <Text className="text-[12px] text-gray-500 m-0">
                              Encrypted data (truncated preview):
                            </Text>
                            <pre
                              className="text-[13px] font-mono m-0 p-0"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {String(a.encryptedData).slice(0, 800)}
                            </pre>
                            <Text className="text-[12px] text-gray-500 m-0">
                              Encrypted data length:{" "}
                              {String(a.encryptedData).length}
                            </Text>
                          </div>
                        )}
                        {a.backupCodes && a.backupCodes.length > 0 && (
                          <Text className="text-[14px] text-gray-700 m-0">
                            <strong>Contained Codes:</strong>{" "}
                            {a.backupCodes.join(", ")}
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {props.userData && (
                <div className="mb-4">
                  <Heading className="text-[16px] font-medium text-gray-900 mb-2">
                    Full User Data (JSON)
                  </Heading>
                  <div className="bg-gray-50 p-3 rounded-[6px]">
                    <pre
                      className="text-[13px] font-mono m-0 p-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {JSON.stringify(props.userData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </Section>

            <Hr className="border-gray-200 my-5" />

            <Section>
              <Heading className="text-[18px] font-bold text-gray-900 mb-2">
                Recommended Recovery Steps
              </Heading>
              <Text className="text-[14px] text-gray-600 mb-3">
                Follow these official steps from Google as a first attempt:
              </Text>

              <div className="overflow-auto">
                <pre
                  className="text-[13px] font-mono m-0 p-0"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {recoveryCode}
                </pre>
              </div>

              <Text className="text-[14px] text-gray-700 mt-3 mb-2">
                <strong>Other methods that may help:</strong>
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                • Use your recovery phone or recovery email if available.
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                • Try recovery from a previously used device or browser.
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                • If needed, prepare identity verification materials for
                appeals.
              </Text>

              {props.recoveryLink && (
                <div className="mt-3">
                  <Link
                    href={props.recoveryLink}
                    className="bg-blue-600 text-white px-4.5 py-2 rounded-[6px] text-[14px] font-medium no-underline inline-block"
                  >
                    Start Recovery
                  </Link>
                </div>
              )}
            </Section>

            <Hr className="border-gray-200 my-5" />

            <Section>
              <Text className="text-[13px] text-gray-600 mb-2">
                If you need more help, visit Google's official recovery page or
                contact our support team for assistance.
              </Text>
              <Link
                href="https://accounts.google.com/signin/recovery"
                className="text-blue-600 text-[13px] underline"
              >
                Google Account Recovery
              </Link>
            </Section>

            <Hr className="border-gray-200 my-5" />

            <Section>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                YourApp Inc. | Security Team
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © {new Date().getFullYear()} YourApp Inc.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AccountRecoveryEmail;
