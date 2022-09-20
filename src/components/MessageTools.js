import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import FolderIcon from "@mui/icons-material/Folder";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
function MessageTools(props) {
  return (
    <div className="flex space-x-4 justify-end">
      <Button
        style={{ textTransform: "capitalize" }}
        disabled
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>

      <Button
        style={{ textTransform: "capitalize" }}
        disabled
        startIcon={<FolderIcon />}
      >
        Archive
      </Button>
      <Button
        style={{ textTransform: "capitalize" }}
        disabled
        startIcon={<UndoIcon />}
      >
        Undo
      </Button>
      <Button
        style={{ textTransform: "capitalize" }}
        disabled
        startIcon={<StarPurple500Icon />}
      >
        Favorite
      </Button>
    </div>
  );
}

export default MessageTools;
