import React, { useState, useEffect } from "react";
import CountriesData from "react-select-country-list";
import Icon from "react-native-vector-icons/Ionicons";
import "./styles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

const App = () => {
  const [description, setDesc] = useState("");
  const [assigny, setAssigny] = useState("");
  const [country, setCountry] = useState("");
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || [],
  );
  const [editIndex, setEditIndex] = useState(-1);
  const countries = CountriesData()
    .getData()
    .map((a) => a.label);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const storageData = localStorage.getItem("tasks");
    if (storageData) {
      let parsedData = JSON.parse(storageData);
      if (parsedData.assigny) {
        setTasks([
          ...tasks,
          {
            assigny: parsedData.assigny,
            desc: parsedData.desc,
            country: parsedData.country,
          },
        ]);
      }
    }
  }, []);

  const Dropdown = ({ placeholder, data, selectedValue, onSelect }) => {
    const [visible, setVisible] = useState(false);

    const handleSelect = (item) => {
      onSelect(item);
      setVisible(false);
    };

    return (
      <View className="relative w-full max-w-xs mb-2">
        <TouchableOpacity
          className={`border border-gray-300 p-2 rounded-md mb-2 text-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
          onPress={() => setVisible(!visible)}
        >
          <Text className={`${isDarkMode ? "text-white" : "text-black"}`}>
            {selectedValue || placeholder}
          </Text>
        </TouchableOpacity>
        {visible && (
          <View className="absolute top-full left-0 right-0 bg-white border border-gray-400 rounded-md mt-1 max-h-40 overflow-hidden">
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-2 border-b border-gray-300 ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                    //  item === selectedValue ? "bg-blue-100" : "bg-red-400")
                  }`}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    className={`${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    );
  };

  const handleAddTask = () => {
    if (assigny === "") {
      alert("Must assign task to someone!");
      return;
    } else if (country === "") {
      alert("Must select a country!");
      return;
    } else if (description.length > 250) {
      alert("Description must be 250 characters or less!");
      return;
    } else if (description.length < 1) {
      alert("Must give a description!");
      return;
    }

    if (editIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = { assigny, desc: description, country };
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setEditIndex(-1);
    } else {
      const updatedTasks = [...tasks, { assigny, desc: description, country }];
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    }
    setDesc("");
    setAssigny("");
    setCountry("");
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setAssigny(taskToEdit.assigny);
    setDesc(taskToEdit.desc);
    setCountry(taskToEdit.country);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const renderItem = ({ item, index }) => (
    <View
      className={`flex flex-row justify-between items-center mb-3 p-4 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
    >
      <View className="flex-1">
        <Text
          className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-black"}`}
        >
          {item.assigny}
        </Text>
        <Text
          className={`text-lg italic ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {item.country}
        </Text>
        <Text
          className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {item.desc}
        </Text>
      </View>
      <View className="flex flex-row ml-4">
        <TouchableOpacity
          onPress={() => handleEditTask(index)}
          className="mr-4"
        >
          <Text className="text-cyan-900 font-bold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Text className="text-red-500 font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 p-10 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <View style={{ position: "absolute", top: 20, right: 20 }}>
        {" "}
        {/* Use absolute positioning */}
        <TouchableOpacity
          onPress={toggleDarkMode}
          className={`border rounded-full
                    w-10 h-10
                    ${isDarkMode ? "border-white bg-gray-800" : "border-gray-400 bg-gray-200"}`}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Text
            className={`text-lg text-center ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text className={`text-2xl font-bold mb-4 ${"text-cyan-900"}`}>
        FJNCH
      </Text>
      <Text
        className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}
      >
        ToDo List
      </Text>
      <TextInput
        className={`relative w-full max-w-xs border border-gray-300 p-2 rounded-md mb-2 text-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        placeholder="Assigny"
        value={assigny}
        onChangeText={setAssigny}
      />
      <Dropdown
        placeholder="Country"
        data={countries}
        selectedValue={country}
        onSelect={setCountry}
      />
      <TextInput
        maxLength={250}
        className={`border border-gray-300 p-2 rounded-md mb-2 h-40 text-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        placeholder="Description"
        value={description}
        onChangeText={setDesc}
      />
      <TouchableOpacity
        className="bg-cyan-900 p-3 rounded-md mb-4"
        onPress={handleAddTask}
      >
        <Text className="text-white text-lg text-center">
          {editIndex !== -1 ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default App;
