import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../../redux/userRelated/userHandle";
import { Card, CardContent, CardMedia, Button, Typography, TextField, Box } from "@mui/material";
import profilephoto from '../../assets/OIP.jpg'

const AdminProfile = () => {
    const dispatch = useDispatch();
    const { currentUser, status, error } = useSelector((state) => state.user);

    // Local state for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [editMode, setEditMode] = useState(false);

    // Fetch user on component mount
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    // Populate form fields when user data is fetched
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
            setSchoolName(currentUser.schoolName);
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser({ name, email, schoolName }));
        setEditMode(false);
    };

    if (status === "loading") return <p>Loading...</p>;
    if (status === "error") return <p>{error || "Something went wrong"}</p>;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <Card sx={{ maxWidth: 500, width: "100%" }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={currentUser?.profileImage || profilephoto} 
                    alt="Profile Picture"
                />
                <CardContent>
                    {!editMode ? (
                        <Box>
                            <Typography variant="h5" component="div" gutterBottom>
                                {currentUser?.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <strong>Email:</strong> {currentUser?.email}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <strong>School:</strong> {currentUser?.schoolName}
                            </Typography>
                            <Box sx={{ marginTop: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditMode(true)}
                                    sx={{ marginRight: 1 }}
                                >
                                    Edit Profile
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="School"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                            />
                            <Box sx={{ marginTop: 2 }}>
                                <Button type="submit" variant="contained" sx={{ marginRight: 1 }}>
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminProfile;
