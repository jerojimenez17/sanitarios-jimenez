import {
  Avatar,
  Backdrop,
  Box,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, DocumentData } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { fetchSales, addProductsToClient, db } from "../../services/FireBase";
import { blue, green } from "@mui/material/colors";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { CartContext } from "./context/CartContext";
import { Console } from "console";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface CartModalProps {
  open: boolean;
  handleClose: (value: React.SetStateAction<boolean>) => void;
}

export default function TransitionsModal({
  open,
  handleClose,
}: CartModalProps) {
  const [counts, setCounts] = useState<DocumentData[] | null>([]);

  useEffect(() => {
    fetchSales().then((data: DocumentData[] | null) => {
      setCounts(data);
    });
  }, []);

  const { cartState, clientName, removeAll } = useContext(CartContext);
  const addProductsToCount = async (sale: DocumentData) => {
    await addProductsToClient(sale, cartState.products);
  };
  const collectionRef = collection(db, "sales");

  const handleNewCount = (e: any) => {
    if (e.key === "Enter") {
      clientName(e.target.value);
      setTimeout(() => {
        if (cartState.products.length !== 0) {
          const now = Date.now();

          cartState.date = new Date(now);
          console.log(cartState.client);
          cartState.id = cartState.date.toLocaleDateString();
          addDoc(collectionRef, cartState);
          removeAll();
          clientName("");
        }
      }, 3000);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Paper>
          <Fade in={open}>
            <Box sx={style}>
              <List>
                <ListItem>
                  <Avatar sx={{ bgcolor: green[500] }}>
                    <CreateNewFolderIcon />
                  </Avatar>
                  <TextField
                    sx={{ marginLeft: 2 }}
                    placeholder="Nueva Cuenta"
                    onKeyDown={handleNewCount}
                  ></TextField>
                </ListItem>
                {counts?.map((sale) => {
                  return (
                    <ListItemButton onClick={() => addProductsToCount(sale)}>
                      <Avatar sx={{ bgcolor: blue[500] }}>
                        <AssignmentIcon />
                      </Avatar>
                      <Typography ml={3}>{sale.client}</Typography>
                    </ListItemButton>
                  );
                })}
              </List>
              <Divider />
            </Box>
          </Fade>
        </Paper>
      </Modal>
    </div>
  );
}
