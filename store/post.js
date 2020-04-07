export default (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      link: DataTypes.STRING,
      body: DataTypes.STRING,
      golos_classic: DataTypes.STRING,
      steem: DataTypes.STRING,
      cyber: DataTypes.STRING,
    },
    {}
  );
  //Post.associate = function (models) {
  // associations can be defined here
  //};
  return Post;
};
