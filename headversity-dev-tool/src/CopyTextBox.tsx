import { Button, ButtonProps, Divider, Icon, Label } from "semantic-ui-react";

interface CopyTextBoxProps {
  content: string;
}

export const CopyTextBox: React.FC<CopyTextBoxProps> = ({
  content,
}): JSX.Element => {
  const onCopyClick = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    __: ButtonProps
  ) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <>
      <Button size="mini" animated="vertical" onClick={onCopyClick}>
        <Button.Content hidden>Copy</Button.Content>
        <Button.Content visible>
          <Icon name="copy" />
        </Button.Content>
      </Button>
    </>
  );
};
