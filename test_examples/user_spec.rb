require 'rspec'

describe "User authentication" do
  let(:user) { User.new(email: "test@example.com", password: "password123") }

  before do
    Database.clean
  end

  after do
    user.destroy if user.persisted?
  end

  context "with valid credentials" do
    it "allows login" do
      result = User.authenticate("test@example.com", "password123")
      expect(result).to be_truthy
    end

    it "redirects to dashboard" do
      session = User.login("test@example.com", "password123")
      expect(session[:redirect_to]).to eq "/dashboard"
    end
  end

  context "with invalid credentials" do
    it "shows error message" do
      result = User.authenticate("test@example.com", "wrongpassword")
      expect(result).to be_falsey
    end

    it "does not create session" do
      session = User.login("test@example.com", "wrongpassword")
      expect(session).to be_nil
    end
  end

  xcontext "feature not yet implemented" do
    xit "should handle OAuth login" do
      # TODO: Implement OAuth authentication
    end
  end

  describe "password reset" do
    let(:reset_token) { "abc123" }

    it "generates reset token" do
      user.generate_password_reset
      expect(user.reset_token).not_to be_nil
    end
  end
end