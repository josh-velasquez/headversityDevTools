import { Button, Modal } from "semantic-ui-react";

interface PopupProps {
  title: string;
  content: string;
}

export const Popup: React.FC<PopupProps> = ({
  title,
  content,
}: PopupProps): JSX.Element => {
  return (
    <Modal
      trigger={<Button>Show Modal</Button>}
      header={title}
      content={content}
      actions={[{ key: "done", content: "Done", positive: true }]}
    />
  );
};
