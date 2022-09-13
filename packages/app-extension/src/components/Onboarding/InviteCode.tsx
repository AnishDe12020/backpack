import { useCustomTheme } from "@coral-xyz/themes";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { supabase } from "../../supabase";
import { PrimaryButton, SubtextParagraph, TextField } from "../common";
import { BackpackHeader } from "../common/BackpackHeader";

export const InviteCode = ({
  onNext,
  showExistingUserFlow,
}: {
  onNext: (inviteCode: string) => void;
  showExistingUserFlow: any;
}) => {
  const [code, setCode] = useState("");
  const [inviteCodeError, setInviteCodeError] = useState<string>();
  const theme = useCustomTheme();

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .limit(1)
        .eq("id", code);
      if (data?.[0] && !data[0].user_id) {
        onNext(code);
      } else {
        throw new Error(error?.message || "Invalid invite code");
      }
    } catch (err: any) {
      setInviteCodeError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        backgroundColor: theme.custom.colors.nav,
        textAlign: "center",
      }}
    >
      <Box>
        <BackpackHeader />
      </Box>

      <Box
        sx={{
          marginLeft: "16px",
          marginRight: "16px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <Box style={{ marginBottom: 8 }}>
          <TextField
            inputProps={{ name: "invite-code" }}
            placeholder="Invite code"
            type="text"
            value={code}
            setValue={setCode}
            isError={inviteCodeError}
          />
          {inviteCodeError && (
            <Typography sx={{ color: theme.custom.colors.negative }}>
              {inviteCodeError}
            </Typography>
          )}
        </Box>

        <PrimaryButton disabled={!code} label="Go" onClick={handleSubmit} />

        <Box onClick={showExistingUserFlow}>
          <SubtextParagraph style={{ marginTop: "8px" }}>
            I already have an account
          </SubtextParagraph>
        </Box>
      </Box>
    </Box>
  );
};
