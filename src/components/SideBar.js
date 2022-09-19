import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
function SideBar(props) {
  const { activeLink, selectData } = props;

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
            className={activeLink === "Inbox" ? "bg-gray-300" : ""}
          >
            <ListItemButton onClick={() => selectData("Inbox")}>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            className={activeLink === "Sent" ? "bg-gray-300" : ""}
          >
            <ListItemButton onClick={() => selectData("Sent")}>
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
