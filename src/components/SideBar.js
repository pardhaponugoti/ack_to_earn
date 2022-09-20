import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
function SideBar(props) {
  const { messageType, setMessageType } = props;

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <List style={{ backgroundColor: "#dfdddd6b", height: "88vh" }}>
          <ListItem
            disablePadding
            className={messageType === "Inbox" ? "bg-gray-300" : ""}
          >
            <ListItemButton onClick={() => setMessageType("Inbox")}>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            className={messageType === "Sent" ? "bg-gray-300" : ""}
          >
            <ListItemButton onClick={() => setMessageType("Sent")}>
              <ListItemText primary="Sent" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Favorites" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Notes" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Others" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );
}

export default SideBar;
