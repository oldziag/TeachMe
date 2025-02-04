import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getEvents, createEvent, getUsers, getUsername, getAvatar } from 'lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";
import DropDownPicker from 'react-native-dropdown-picker';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const { user } = useGlobalContext();
  const [users, setUsers] = useState<User[]>([]);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null); 
  const [openCategory, setOpenCategory] = useState(false);
  const [category, setCategory] = useState<string | null>(null); 

  type User = {
    userId: string;
    username: string;
    avatar: string;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        const usersList = await Promise.all(
          usersData.map(async (u: any) => ({
            userId: u.userId,
            username: await getUsername(u.userId),
            avatar: u.avatar || await getAvatar(u.userId),
          }))
        );
        setUsers(usersList);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
      }
    };

    fetchUsers();
  }, []);

  const create = async () => {
    if (!title || !selectedDate || !hour || !selectedUser) {
      return;
    }
    try {
        console.log(hour)
      await createEvent(title, user.userId, selectedDate, hour,selectedUser?.userId);
      setTitle('');
      setHour('');
      setSelectedUser(null);
    } catch (error) {
      console.error("Błąd tworzenia ogłoszenia:", error.message || error);
    }
  };

  const fetchEventsDetails = async (selectedDate) => {
    try {
      const events1 = await getEvents();
      const event1 = events1.find((event1: any) => event1.day === selectedDate);
      if (event1) {
        return { ...event1 };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchEventsDetails(selectedDate).then((details) => {
        if (details) {
          setEventDetails(details);
        }
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Błąd ładowania zajęć:', error);
      }
    };
    fetchEventsData();
  }, []);

  const polishMonthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'black' },
          }}
          renderHeader={(date) => (
            <Text style={styles.headerText}>
              {polishMonthNames[date.getMonth()]} {date.getFullYear()}
            </Text>
          )}
          firstDay={1}
          monthFormat={'yyyy MM'}
          theme={{
            backgroundColor: 'black',
            calendarBackground: 'black',
            textSectionTitleColor: 'white',
            selectedDayBackgroundColor: '#1c9e92',
            selectedDayTextColor: 'white',
            todayTextColor: 'white',
            dayTextColor: 'white',
            textDisabledColor: 'gray',
            monthTextColor: 'white',
            arrowColor: '#1c9e92',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 27,
            textMonthFontSize: 27,
            textDayHeaderFontSize: 21,
          }}
        />
      </View>

      {selectedDate ? <Text style={styles.selectedDate}> {selectedDate}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Zajęcia"
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Godzina"
        placeholderTextColor="gray"
        value={hour}
        onChangeText={setHour}
      />

      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={openCategory}
          value={category}
          items={users.map((user) => ({
            label: user.username,
            value: user.userId,
            avatar: user.avatar,
          }))}
          setOpen={setOpenCategory}
          setValue={setCategory}
          placeholder="Wybierz ucznia..."
          placeholderStyle={{ color: 'gray', fontSize: 18 }}
          containerStyle={styles.pickerContainer}
          style={styles.picker}
          dropDownContainerStyle={styles.dropDown}
          mode="BADGE"
          onChangeValue={(value) => {
            const selected = users.find((user) => user.userId === value);
            setSelectedUser(selected || null);
          }}
        />
        <Text
          style={styles.addEventButton}
          onPress={create}>
          Dodaj zajęcia
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    paddingTop: 50,
  },
  input: {
    backgroundColor: 'white',
    marginTop: 20,
    width: 270,
    height: 50,
    alignSelf: 'center',
    borderRadius: 18,
    paddingLeft: 10,
  },
  calendarContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  selectedDate: {
    marginTop: 70,
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  pickerContainer: {
    width: 270,
    alignSelf: 'center',
    marginTop: 30,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 18,
  },
  dropDown: {
    backgroundColor: 'white',
    borderRadius: 18,
  },
  addEventButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 30,
  },
});
