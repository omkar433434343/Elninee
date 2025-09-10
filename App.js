// App.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentbook, setCurrentbook] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(210); // 3:30 in seconds
  const [volume, setVolume] = useState(70);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one
  const [showPlayer, setShowPlayer] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Sample music data
  const books = [
    { id: 1, title: "mobi dick", artist: "no idea", duration: "53:20", image: "https://m.media-amazon.com/images/I/712mdW4zCcL._UF1000,1000_QL80_.jpg" },
    { id: 2, title: "the fighter", artist: "no idea", duration: "32:54", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3H-fJKQlmdcJEmRKxMMStRkTNyizcQqEcQ&s" },
    { id: 3, title: "run", artist: "no idea", duration: "53:23", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2KuFBHfsxQZK3XSsXtiRqaXOWcRn2MId1Tw&s" },
    { id: 4, title: "where's the sky", artist: "no idea", duration: "32:58", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ6I3qh_LXrv3cekXyKNfj2co8QR98K0brUA&s" },
    { id: 5, title: "chasing", artist: "no idea", duration: "22:21", image: "https://skyryedesign.com/wp-content/uploads/2016/04/56c6f9b7efad5-cover-books-design-illustrations.jpg" },
    { id: 6, title: "chill", artist: "no idea", duration: "53:32", image: "https://marketplace.canva.com/EAFaEkYFwCo/3/0/1003w/canva-black-and-grey-dark-forest-aesthetic-book-cover-ZVZ_whx7Nu8.jpg" },
  ];

  const playlists = [
    { id: 1, name: "mix", bookCount: 2, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop" },
    { id: 2, name: "Chill Vibes", bookCount: 4, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
    { id: 3, name: "Workout Hits", bookCount: 5, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop" },
    { id: 4, name: "Late Night", bookCount: 3, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
  ];

  const genres = [
    { name: 'Pop', color: '#8E4EC6' },
    { name: 'Rock', color: '#E13300' },
    { name: 'Hip-Hop', color: '#148A08' },
    { name: 'Electronic', color: '#8D67AB' },
    { name: 'Jazz', color: '#BA5D07' },
    { name: 'Classical', color: '#477D95' },
    { name: 'Country', color: '#8C1932' },
    { name: 'R&B', color: '#1E3264' },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlebookSelect = (book) => {
    setCurrentbook(book);
    setIsPlaying(true);
    setShowPlayer(true);
  };

  const filteredbooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Bookitem = ({ book, index }) => (
    <TouchableOpacity
      style={styles.Bookitem}
      onPress={() => handlebookSelect(book)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: book.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.bookArtist} numberOfLines={1}>{book.artist}</Text>
      </View>
      <Text style={styles.bookDuration}>{book.duration}</Text>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const BookCard = ({ playlist }) => (
    <TouchableOpacity style={styles.BookCard} activeOpacity={0.7}>
      <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
      <Text style={styles.playlistName} numberOfLines={2}>{playlist.name}</Text>
      <Text style={styles.playlistCount}>{playlist.bookCount} books</Text>
    </TouchableOpacity>
  );

  const GenreCard = ({ genre }) => (
    <TouchableOpacity
      style={[styles.genreCard, { backgroundColor: genre.color }]}
      activeOpacity={0.8}
    >
      <Text style={styles.genreText}>{genre.name}</Text>
    </TouchableOpacity>
  );

  const renderSideMenu = () => {
    if (!showSideMenu) return null;

    return (
      <View style={styles.sideMenuOverlay}>
        <TouchableOpacity
          style={styles.sideMenuBackground}
          activeOpacity={1}
          onPress={() => setShowSideMenu(false)}
        />
        <View style={styles.sideMenu}>
          <View style={styles.sideMenuHeader}>
            <Text style={styles.sideMenuTitle}>Elnine</Text>
            <TouchableOpacity onPress={() => setShowSideMenu(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sideMenuContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.sideMenuItem, activeTab === 'home' && styles.sideMenuItemActive]}
              onPress={() => {
                setActiveTab('home');
                setShowSideMenu(false);
              }}
            >
              <Ionicons name="home" size={20} color={activeTab === 'home' ? "#be29ec" : "#9CA3AF"} />
              <Text style={[styles.sideMenuItemText, activeTab === 'home' && styles.sideMenuItemTextActive]}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sideMenuItem, activeTab === 'search' && styles.sideMenuItemActive]}
              onPress={() => {
                setActiveTab('search');
                setShowSideMenu(false);
              }}
            >
              <Ionicons name="search" size={20} color={activeTab === 'search' ? "#be29ec" : "#9CA3AF"} />
              <Text style={[styles.sideMenuItemText, activeTab === 'search' && styles.sideMenuItemTextActive]}>
                Search
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sideMenuItem, activeTab === 'library' && styles.sideMenuItemActive]}
              onPress={() => {
                setActiveTab('library');
                setShowSideMenu(false);
              }}
            >
              <Ionicons name="library" size={20} color={activeTab === 'library' ? "#be29ec" : "#9CA3AF"} />
              <Text style={[styles.sideMenuItemText, activeTab === 'library' && styles.sideMenuItemTextActive]}>
                Your Library
              </Text>
            </TouchableOpacity>

            <View style={styles.sideMenuDivider} />

            <TouchableOpacity style={styles.sideMenuItem}>
              <Ionicons name="download" size={20} color="#9CA3AF" />
              <Text style={styles.sideMenuItemText}>Downloads</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem}>
              <Ionicons name="heart" size={20} color="#9CA3AF" />
              <Text style={styles.sideMenuItemText}>Liked books</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem}>
              <Ionicons name="musical-notes" size={20} color="#9CA3AF" />
              <Text style={styles.sideMenuItemText}>Recently Played</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem}>
              <Ionicons name="time" size={20} color="#9CA3AF" />
              <Text style={styles.sideMenuItemText}>History</Text>
            </TouchableOpacity>

            <View style={styles.sideMenuDivider} />

            <TouchableOpacity style={styles.sideMenuItem}>
              <Ionicons name="settings" size={20} color="#9CA3AF" />
              <Text style={styles.sideMenuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideMenuItem}>
              <Ionicons name="help-circle" size={20} color="#9CA3AF" />
              <Text style={styles.sideMenuItemText}>Help & Feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };
  const renderProfileContent = () => (
    <View style={styles.profileContainer}>
      <Text>Sign up</Text>
      <TouchableOpacity><Text></Text></TouchableOpacity>
    </View>
  );

  const renderHomeContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For you</Text>
        <FlatList
          data={playlists}
          renderItem={({ item }) => <BookCard playlist={item} />}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently played</Text>
        {books.slice(0, 6).map((book, index) => (
          <Bookitem key={book.id} book={book} index={index} />
        ))}
      </View>
    </ScrollView>
  );

  const renderSearchContent = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to listen to?"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {searchQuery ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          {filteredbooks.map((book, index) => (
            <Bookitem key={book.id} book={book} index={index} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Browse all</Text>
          <View style={styles.genreGrid}>
            {genres.map((genre, index) => (
              <GenreCard key={index} genre={genre} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );

  const renderLibraryContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.libraryHeader}>
        <Text style={styles.sectionTitle}>Your Library</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#be29ec" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <FlatList
          data={playlists}
          renderItem={({ item }) => <BookCard playlist={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.playlistRow}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Liked books</Text>
        {books.map((book, index) => (
          <Bookitem key={book.id} book={book} index={index} />
        ))}
      </View>
    </ScrollView>
  );

  const renderPlayer = () => {
    if (!showPlayer || !currentbook) return null;

    const progress = (currentTime / duration) * 100;

    return (
      <View style={styles.playerContainer}>
        {/* Mini Player */}
        <TouchableOpacity style={styles.miniPlayer} activeOpacity={0.9}>
          <Image source={{ uri: currentbook.image }} style={styles.miniPlayerImage} />
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentbook.title}</Text>
            <Text style={styles.miniPlayerArtist} numberOfLines={1}>{currentbook.artist}</Text>
          </View>
          <TouchableOpacity onPress={handlePlayPause} style={styles.miniPlayerButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff0000ff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowSideMenu(true)}
          style={styles.burgerButton}
        >
          <Ionicons name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Elninee</Text>
        <View style={styles.headerRight}>

          <TouchableOpacity style={styles.headerButton} onPress={() => setActiveTab('search')}>
            <Ionicons name="notifications-outline" size={30} color="#9CA3AF" />
          </TouchableOpacity>

        </View>
      </View>

      {/* Content */}
      <View style={styles.mainContainer}>
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'search' && renderSearchContent()}
        {activeTab === 'library' && renderLibraryContent()}
        {activeTab === 'profile' && renderProfileContent()}
      </View>

      {/* Side Menu */}
      {renderSideMenu()}

      {/* Player */}
      {renderPlayer()}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? "home" : "home-outline"}
            size={24}
            color={activeTab === 'home' ? "#be23ec" : "#9CA3AF"}
          />
         
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('search')}
        >
          <Ionicons
            name={activeTab === 'search' ? "search" : "search-outline"}
            size={24}
            color={activeTab === 'search' ? "#be23ec" : "#9CA3AF"}
          />
          
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('library')}
        >
          <Ionicons
            name={activeTab === 'library' ? "library" : "library-outline"}
            size={24}
            color={activeTab === 'library' ? "#be23ec" : "#9CA3AF"}
          />
          
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? "person-outline" : "person-outline"}
            size={24}
            color={activeTab === 'profile' ? "#be23ec" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cecbcb9c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:50,
    marginLeft:10,
    marginRight:10,
  },
  burgerButton: {
    padding: 5,
    marginRight: 15,
    marginLeft:10,
    backgroundColor: '#000000ff',
    borderRadius: 80,
  },
  headerTitle: {
    fontSize: 20,
    paddingTop: 0,
    fontWeight: 'bold',
    color: '#be29ec',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
    marginRight:10,
    backgroundColor: '#000000ff',
    borderRadius: 80,
  },
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000ff',
    marginBottom: 15,
    marginTop: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000ff',
    marginBottom: 15,
  },
  horizontalList: {
    paddingRight: 20,
  },
  BookCard: {
    backgroundColor: '#000000ff',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 160,
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  playlistName: {
    color: '#ffffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  playlistCount: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  playlistRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  Bookitem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  bookImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  bookArtist: {
    color: '#000000ff',
    fontSize: 14,
  },
  bookDuration: {
    color: '#9CA3AF',
    fontSize: 12,
    marginRight: 10,
  },
  moreButton: {
    padding: 5,
  },
  searchContainer: {
    marginVertical: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000ff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffffff',
    fontSize: 16,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreCard: {
    width: (width - 50) / 2,
    height: 100,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  genreText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 0,
  },
  playerContainer: {
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  miniPlayerImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
    marginRight: 10,
  },
  miniPlayerTitle: {
    color: '#000000ff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  miniPlayerArtist: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  miniPlayerButton: {
    marginRight: 15,
  },
  progressContainer: {
    height: 2,
    backgroundColor: '#374151',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#BE29EC',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000000ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom:20,
    marginLeft:10,
    marginRight:10,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    borderRadius: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navText: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  navTextActive: {
    color: '#23',
  },
  // Side Menu Styles
  sideMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sideMenuBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#111827',
    paddingTop: 50,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sideMenuTitle: {
    fontSize: 18,
    paddingTop: 10,
    fontWeight: 'bold',
    color: '#be29ec',
  },
  sideMenuContent: {
    flex: 1,
    paddingTop: 20,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  sideMenuItemActive: {
    backgroundColor: '#374151',
  },
  sideMenuItemText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  sideMenuItemTextActive: {
    color: '#BE29EC',
  },
  sideMenuDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
  },
});

export default App;