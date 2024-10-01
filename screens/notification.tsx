import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';

const NotificationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="font-awesome" color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>การแจ้งเตือน</Text>
      </View>
      <View style={styles.notificationContainer}>
        <TouchableOpacity style={styles.notificationItem}>
          <Text>Notification 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationItem}>
          <Text>Notification 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationItem}>
          <Text>Notification 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5d3c1',
  },
  headerText: {
    fontSize: 18,
    marginLeft: 16,
    fontWeight: 'bold',
  },
  notificationContainer: {
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    backgroundColor: '#f5d3c1',
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default NotificationScreen;
